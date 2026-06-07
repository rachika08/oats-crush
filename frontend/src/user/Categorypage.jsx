import { useParams } from "react-router-dom";

export default function CategoryPage() {
    const { id } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Category ID: {id}
            </h1>
        </div>
    );
}