"""Parser for *.req files."""

from core.requirement import Requirement
from core.matchers import Matcher

from dataclasses import dataclass


@dataclass
class ParserOutput:
    """ParserOutput is a class that contains the output of the parser.

    Note:
        Requirement key is not the same as the requirement name. Requirement key
        is used in *.req files and by the parser to reference requirements, while requirement name
        is a UI friendly name.

    Args:
        requirements (dict[str, Requirement]): A dictionary of requirements by requirement key.
        requirement_groups (list[list[Requirement]]): A list of requirement groups,
            where each requirement group is a list of requirements.
    """

    requirements: dict[str, Requirement]
    requirement_groups: list[list[Requirement]]


class ParserException(Exception):
    """ParserException is an exception that is raised when the parser encounters an error."""


class Parser:
    """Parser is a class that parses a degree requirements file and returns a ParserOutput object."""

    contents: str
    definitions: dict[str, str]
    requirements: dict[str, Requirement]
    requirement_groups: list[list[Requirement]]

    def __init__(self, contents: str):
        self.contents = contents
        self.definitions = {}
        self.requirements = {}
        self.requirement_groups = []

    def parse(self) -> ParserOutput:
        """Parse the file and return a ParserOutput object."""
        self._parse()
        return ParserOutput(
            self.requirements,
            self.requirement_groups,
        )

    def _parse(self) -> None:
        """Parse the file.

        Evaluates each line separately as a "command". Commands are in the format COMMAND [ARGS..].

        Commands include:
        - DEFINE KEY MATCHER
        - REQUIRE NAME REQ_KEY REQ_HOURS MATCHER
        - GROUP REQ_KEY [REQ_KEY..]
        """
        for line_num, line in enumerate(self.contents.splitlines(), start=1):
            line = line.strip()

            # Ignore comments and blank lines.
            if line.startswith("#") or not line:
                continue

            # All lines must follow the format COMMAND [ARGS..]
            command_arg_pair = line.split(maxsplit=1)
            if len(command_arg_pair) != 2:
                raise ParserException(
                    f"Line {line_num}: Expected line to be in format COMMAND [ARGS..], got {command_arg_pair}."
                )

            command, args = command_arg_pair
            match command:
                case "DEFINE":
                    self._parse_define(line_num, args)
                case "REQUIRE":
                    self._parse_require(line_num, args)
                case "GROUP":
                    self._parse_group(line_num, args)
                case _:
                    raise ParserException(
                        f"Line {line_num}: Unknown command {command}."
                    )

    def _parse_define(self, line_num: int, args: str) -> None:
        """Parse a DEFINE command.

        The DEFINE command is in the format: DEFINE KEY MATCHER.
        """
        kv_pair = args.split(maxsplit=1)
        if len(kv_pair) != 2:
            raise ParserException(
                f"Line {line_num}: Expected line to be in format DEFINE KEY ARGS, got {kv_pair}."
            )
        # Expand previously defined defintions.
        expanded_value = self._expand_definitions(kv_pair[1])
        self.definitions[kv_pair[0]] = expanded_value

    def _parse_require(self, line_num: int, args: str) -> None:
        """Parse a REQUIRE command.

        The REQUIRE command is in the format: REQUIRE NAME REQ_KEY REQ_HOURS MATCHER.
        """

        # Split requirement name from request of args.
        if len(args) != 0 and args[0] == '"':
            # Handle double quoted requirement name.
            end_quote_idx = args.index('"', 1)
            if end_quote_idx == -1:
                raise ParserException(
                    f"Line {line_num}: Unterminated string literal in REQUIRE."
                )
            # Extract requirement name and advance args past it.
            req_name = args[1:end_quote_idx]
            args = args[end_quote_idx + 1 :].strip()
        else:
            # Extract requirement name and advance args past it.
            req_name_args_pair = args.split(maxsplit=1)
            if len(req_name_args_pair) != 2:
                raise ParserException(
                    f"Line {line_num}: Expected line to be in format REQUIRE NAME ARGS, got {req_name_args_pair}."
                )
            req_name, args = req_name_args_pair

        arg_list = args.split(maxsplit=2)
        if len(arg_list) != 3:
            raise ParserException(
                f"Line {line_num}: Expected line to be in format REQUIRE NAME REQ_KEY REQ_HOURS MATCHER, got {req_name_args_pair}."
            )

        req_key, req_hours_str, matcher_str = arg_list
        # Attempt to parse REQ_HOURS as an integer.
        try:
            req_hours = int(req_hours_str)
        except ValueError:
            raise ParserException(
                f"Line {line_num}: Expected REQ_HOURS to be an integer, got {req_hours_str}."
            )
        # Expand previously defined defintions.
        matcher_str = self._expand_definitions(matcher_str)

        # Attempt to parse matcher string.
        matcher = Parser._parse_matcher_str(line_num, matcher_str)

        # Build and save requirement by key.
        requirement = Requirement(req_name, req_hours, matcher)
        self.requirements[req_key] = requirement

    def _parse_group(self, line_num: int, args: str) -> None:
        """Parse a GROUP command.

        The GROUP command is in the format: GROUP REQ_KEY [REQ_KEY..]
        """

        requirement_group: list[Requirement] = []
        for req_key in args.split():
            if req_key not in self.requirements:
                raise ParserException(
                    f"Line {line_num}: Requirement {req_key} not found."
                )
            requirement_group.append(self.requirements[req_key])
        self.requirement_groups.append(requirement_group)

    def _expand_definitions(self, line: str) -> str:
        """Expand all definitions in a line. Definitions that were not defined beforehand will be ignored."""
        for key, value in self.definitions.items():
            line = line.replace(key, value)
        return line

    @staticmethod
    def _parse_matcher_str(line: int, matcher_str: str) -> Matcher:
        """Function to parse a matcher string to a Matcher object tree"""
        stack: list[Matcher | Matcher.Builder | list[str]] = []

        def process_end_of_arg() -> None:
            # Pop off the arg (must be Matcher or list)
            if not stack or type(stack[-1]) == Matcher.Builder:
                raise ParserException(
                    f"Line {line}: Unexpected comma or close parentheses, or missing argument."
                )

            arg = stack.pop()
            if type(arg) == list:  # Build un-combined string to string
                arg = "".join(arg)  # type: ignore
            # Add arg to builder
            if not stack or type(stack[-1]) != Matcher.Builder:
                raise ParserException(
                    f"Line {line}: Unexpected comma or close parentheses."
                )
            stack[-1].add_arg(arg)  # type: ignore

        for c in matcher_str:
            # End of matcher type: Create builder
            if c == "(":
                if not stack or type(stack[-1]) != list:
                    raise ParserException(f"Line {line}: Unexpected open parentheses.")
                if len(stack) >= 2 and type(stack[-2]) != Matcher.Builder:
                    raise ParserException(f"Line {line}: Unexpected new matcher.")
                stack[-1] = Matcher.Builder("".join(stack[-1]))

            # End of arg: Create builder
            elif c == ",":
                process_end_of_arg()

            # End of matcher arg(s)
            elif c == ")":
                # If the previous element is a builder with no args, don't try to process arg.
                if (
                    not stack
                    or not isinstance(stack[-1], Matcher.Builder)
                    or stack[-1].args
                ):
                    process_end_of_arg()
                stack[-1] = stack[-1].build()  # type: ignore

            # Build string, which might be part of matcher type or arg.
            else:
                if not stack or type(stack[-1]) != list:
                    stack.append([])
                stack[-1].append(c)  # type: ignore

        if len(stack) != 1 or not issubclass(type(stack[0]), Matcher):
            raise ParserException(
                f"Line {line}: Unable to parse malformed matcher string."
            )
        return stack[0]  # type: ignore
