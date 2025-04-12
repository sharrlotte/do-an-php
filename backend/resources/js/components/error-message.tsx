export default function ErrorMessage({ message }: { message: unknown }) {
    return <div className="m-auto font-semibold text-red-500">{JSON.stringify(message)}</div>;
}
