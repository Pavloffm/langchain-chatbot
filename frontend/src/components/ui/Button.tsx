import type {ButtonHTMLAttributes} from "react";
import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({children, ...props}: ButtonProps) {
    return (
        <button className="button" {...props}>
            {children}
        </button>
    );
}
