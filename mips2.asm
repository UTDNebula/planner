.data 
first: .asciiz "Give me a number between 1 and 10 (0 to stop):  "
ans: .asciiz "The count down of integers from "
is: .asciiz " is: "
iterative: .asciiz "ITERATIVE: "
recursive: .asciiz "RECURSIVE: "
space: .asciiz " "
newline: .asciiz "\n"

.text
li $v0, 4
la $a0, first 
syscall 

li $v0, 5
syscall 
move $t1, $v0

beq $t1, $zero, exit
add $t2, $t1, $zero

li $v0, 4
la $a0, ans
syscall 
li $v0, 1
addi $a0, $t1, 0
syscall 
li $v0, 4
la $a0, is
syscall 

li $v0, 4
la $a0, newline
syscall 
li $v0, 4
la $a0, iterative 
syscall 

loop:
bge $t1, $zero, itr_countdown
li $v0, 4
la $a0, newline
syscall 
j recPhrase


itr_countdown:
li $v0, 1
addi $a0, $t1, 0
addi $t1, $t1, -1
syscall
li $v0, 4
la $a0, space 
syscall 
j loop

jal rec_countdown
j exit

rec_countdown:
addi $sp, $sp, -8
sw $ra, 4($sp)
sw $t2, 0($sp)
blt $t2, $zero, rec_end
li $v0, 1
addi $a0, $t2, 0
syscall
li $v0, 4
la $a0, space 
syscall 
addi $t2, $t2, -1
jal rec_countdown
j exit
rec_end:
lw $, 4($sp)
addi $sp, $sp, 8
jr $ra
j exit


recPhrase:
li $v0, 4
la $a0, recursive
syscall 
j rec_countdown

exit: 
li $v0, 10
syscall 

