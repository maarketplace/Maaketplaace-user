import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getOneProduct } from "../../../api/query";

const Details = () => {
    const { id: productIdParam } = useParams<{ id?: any }>();
    const { data } = useQuery(['getoneproduct', productIdParam], () => getOneProduct(productIdParam), {})
    console.log(data);

    return (
        <div>Details</div>
    )
}

export default Details