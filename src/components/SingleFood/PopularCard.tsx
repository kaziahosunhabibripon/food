"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ShoppingCart } from "react-feather";

interface PopularCardProps {
  data: {
    id: number;
    name: string;
    arabic_name: string;
    final_price: number;
    image_url: string;
  };
  isArabic?: boolean;
}

const PopularCard: React.FC<PopularCardProps> = ({
  data,
  isArabic = false,
}) => {
  const { id, name, arabic_name, final_price, image_url } = data;
  const t = useTranslations();
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    const overlay = overlayRef.current;

    const onEnter = () => {
      gsap.to(img, {
        scale: 1.1,
        opacity: 0.7,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(overlay, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
      });
      gsap.to(overlay, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
      });
    };

    card?.addEventListener("mouseenter", onEnter);
    card?.addEventListener("mouseleave", onLeave);

    return () => {
      card?.removeEventListener("mouseenter", onEnter);
      card?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const locale = useLocale();

  return (
    <Link href={`/product/${id}`} passHref>
      <div
        ref={cardRef}
        className="relative group rounded-xl overflow-hidden transition-all duration-300"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Image
          ref={imageRef}
          width={800}
          height={800}
          src={image_url || "/images/placeholder.png"}
          alt={isArabic ? arabic_name : name}
          className="w-full h-64 object-cover transition-all duration-300 p-2"
        />

        {/* Overlay with gradient background */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex flex-col justify-end text-white"
        >
          {/* Bottom bar with title, price, and add to cart button */}
          <div className="flex items-center justify-between w-full ">
            <div>
              <h3 className="text-lg font-bold">
                {locale === "ar" ? arabic_name : name}
              </h3>
              <p className="text-xl font-semibold text-yellow-300">
                {t("hurryUp.currency")}{" "}
                {locale === "ar"
                  ? `${toArabicNumerals(Math.round(Number(final_price)))}`
                  : ` ${Math.round(Number(final_price))}`}
              </p>
            </div>
            <div className="absolute w-36 bottom-1 right-2 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <div className="w-full bg-[#ecbf4c] rounded-lg text-white py-2 font-semibold shadow-md hover:bg-[#ecbf4c] flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t("product.addToCart")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularCard;
