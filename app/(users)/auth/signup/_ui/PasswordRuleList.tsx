import { useState } from "react";
import { HelpCircle } from "lucide-react";

const PASSWORD_RULES = [
  { key: "upper", label: "영문 대문자 포함 (A-Z)" },
  { key: "lower", label: "영문 소문자 포함 (a-z)" },
  { key: "number", label: "숫자 포함 (0-9)" },
  { key: "special", label: "특수문자 포함 (!@#$...)" },
];

export default function PasswordRuleList() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label="비밀번호 규칙 보기"
        className="flex items-center justify-center hover:cursor-pointer"
      >
        <HelpCircle size={14} />
      </button>

      {isVisible && (
        <div className="absolute z-10 mt-2 w-56 rounded-md border bg-white p-3 text-sm shadow-md">
          <p className="mb-1 font-semibold text-gray-700">비밀번호 생성 규칙</p>
          <ul className="list-disc pl-4 text-gray-600">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule.key}>{rule.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
