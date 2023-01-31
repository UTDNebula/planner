import { toast } from 'react-toastify';

export default function ToastWrapper(): JSX.Element {
  return <button onClick={() => toast('Hello world!')}>Click me</button>;
}
