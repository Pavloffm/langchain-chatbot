import type {ChangeEvent, KeyboardEvent} from "react";
import Button from "./Button";
import "./ChatInput.css";

type ChatInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
};

export default function ChatInput({value, onChange, onSubmit, disabled}: ChatInputProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && !disabled) {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="chat-input">
            <textarea
                value={value}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={3}
            />
            <div className="chat-input-actions">
                <Button onClick={onSubmit} aria-label="Send message" disabled={disabled}>↑</Button>
            </div>
        </div>
    );
}
