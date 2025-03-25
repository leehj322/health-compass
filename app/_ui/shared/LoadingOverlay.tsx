import Spinner from "./Spinner";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
