// import { IProduct } from '../../../interface/ProductInterface';
// import ProductCard from './ProductCard';

// interface ProductListProps {
//   products: IProduct[];
//   loggedInUserId: string;
//   handleLikeClick: (productId: string) => void;
//   handleEyeClick: (product: IProduct) => void;
//   handleCartAddingAuth: (id: string) => void;
//   loadingStates: { [key: string]: boolean };
// }

// const ProductList = ({ products, loggedInUserId, handleLikeClick, handleEyeClick, handleCartAddingAuth, loadingStates }: ProductListProps) => {
//   return (
//     <div className="w-[100%] h-[80vh] overflow-scroll p-0 flex flex-wrap gap-[10px] justify-center">
//       {products.map((product) => (
//         <ProductCard
//           key={product._id}
//           product={product}
//           loggedInUserId={loggedInUserId}
//           handleLikeClick={handleLikeClick}
//           handleEyeClick={handleEyeClick}
//           handleCartAddingAuth={handleCartAddingAuth}
//           loadingStates={loadingStates}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProductList;
