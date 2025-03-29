export default function FormDivider() {
  return (
    <div className="flex w-full max-w-md items-center gap-4 py-4">
      <div className="h-px flex-1 bg-gray-300" />
      <span className="text-xs text-gray-500">또는</span>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
