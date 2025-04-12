export default function ErrorMessage({ message }: { message: unknown }) {
    if (message && typeof message === 'object' && 'message' in message && typeof message.message === 'string')
        return <div className="m-auto font-semibold text-red-500">{message.message}</div>;

    return <div className="m-auto font-semibold text-red-500">{JSON.stringify(message)}</div>;
}
