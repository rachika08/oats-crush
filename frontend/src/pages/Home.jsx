
import { useNavigate } from "react-router";

export default function Home(){
    const navigate=useNavigate();
    return(
        <>
        <h1>Oats Fresh</h1>
        <div className="flex gap-4 mt-2">
            

            <button onClick={()=>{
                navigate('/login')

            }}
            className="bg-blue-500 text-white px-2 mr-2">login</button>
            
            <button onClick={()=>{
                navigate('/signup')

            }}
            className="bg-blue-500 text-white px-2 mr-2">Sign up</button>
            

            <button onClick={()=>{
                navigate('/admin/products')

            }}
            className="bg-blue-500 text-white px-2 mr-2">View Products</button>
            
            <button onClick={()=>{
                navigate('/category')
            }}
            className="bg-blue-500 text-white px-2 mr-2">
                View categories
            </button>
        </div>
        </>
    )
}