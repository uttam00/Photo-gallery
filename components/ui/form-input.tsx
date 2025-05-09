import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  className?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function FormInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className,
  required,
  minLength,
  maxLength,
  ...otherProps
}: FormInputProps) {
  const inputProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(
      error ? "border-red-500" : "",
      type === "textarea" ? "min-h-[150px]" : "",
      className
    ),
    placeholder,
    minLength,
    maxLength,
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {type === "textarea" ? (
        <Textarea {...inputProps} />
      ) : (
        <Input type={type} {...inputProps} {...otherProps} />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
