import Spinner from "./_ui/shared/Spinner";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
      <Spinner />
    </div>
  );
}
