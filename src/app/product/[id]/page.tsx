"use client";

import { useParams } from "next/navigation";
import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";
import Loading from "@/app/loading";
import SingleFoodComponent from "@/components/SingleFood";
import { IFood } from "@/types/types";
import NotFoundPage from "@/app/not-found";

export default function ProductPage() {
  const { id } = useParams();
  const { data: allData, isLoading } = useGetAllFoodsQuery({});

  if (isLoading) return <Loading />;

  const product = allData?.items.find(
    (item: IFood) => item.id.toString() === id
  );

  if (!product) return <NotFoundPage />;

  return (
    <div className="min-h-screen">
      <SingleFoodComponent {...product} key={product.id} />
    </div>
  );
}
