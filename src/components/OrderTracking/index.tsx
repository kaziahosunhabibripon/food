/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck
"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { size } from "lodash";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import CommonHeader from "../common/CommonHeader";
import { getOrdersData } from "@/helpers/restApiRequest";
import { useAppSelector } from "@/redux/hooks/hooks";
import { Order } from "@/types/types";
import { useLocale, useTranslations } from "use-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";
import { useGetAllFoodsQuery } from "@/redux/apiSlice/apiSlice";
import Loading from "@/app/loading";
import LocationMap from "./LocationMap";

const steps = [
  {
    id: 1,
    name: "Order Received",
    name_ar: "تم استلام الطلب",
    description: "Your order has been received",
    description_ar: "تم استلام طلبك",
    icon: FaBox,
  },
  {
    id: 2,
    name: "Accepted",
    name_ar: "قيد المعالجة",
    description: "We are preparing your order",
    description_ar: "نقوم بتحضير طلبك",
    icon: FaBox,
  },
  {
    id: 3,
    name: "Completed",
    name_ar: "اكتمل",
    description: "Your order is on its way",
    description_ar: "طلبك في طريقه إليك",
    icon: FaTruck,
  },
  {
    id: 4,
    name: "Delivered",
    name_ar: "تم التوصيل",
    description: "Order has been delivered",
    description_ar: "تم توصيل الطلب",
    icon: FaCheckCircle,
  },
];

const statusOrder = ["Order Received", "Accepted", "Completed", "Delivered"];

const getOrderStatus = (value: string) => {
  const orderStatus = {
    "Order Received": "bg-brand w-1/4",
    "تم استلام الطلب": "bg-brand w-1/4",

    Accepted: "bg-brand w-2/4",
    "تم القبول": "bg-brand w-2/4",

    Completed: "bg-brand w-3/4",
    اكتمل: "bg-brand w-3/4",

    Delivered: "bg-brand w-full",
    "تم التوصيل": "bg-brand w-full",
  };
  return orderStatus[value] || "bg-gray-200";
};

const getOrderStatusForIcon = (currentStatus: string, stepName: string) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepName);
  return stepIndex <= currentIndex ? "bg-brand" : "bg-gray-200";
};

const getStatusColor = (status: string) => {
  const colors = {
    "Order Received": "bg-yellow-100 text-yellow-800",
    Accepted: "bg-blue-100 text-blue-800",
    Completed: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getOrderProgress = (status: string) => {
  const progress = {
    "order received": 25,
    accepted: 50,
    completed: 75,
    delivered: 100,
  };

  const normalizedStatus = status.toLowerCase();

  return progress[normalizedStatus] || 0;
};

const OrderTrackingComponent = () => {
  const t = useTranslations("tracking");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);
  const [orderInfo, setOrderInfo] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: foodData, isLoading: isFoodLoading } = useGetAllFoodsQuery({});

  const getOrderInfo = async () => {
    try {
      const response = await getOrdersData();

      if (size(response)) {
        const orders = response?.data?.orders || [];

        setOrderInfo(orders); // no reverse needed
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getOrderInfo();
    const intervalId = setInterval(getOrderInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useLayoutEffect(() => {
    if (size(user) < 0) {
      router.push("/");
      router.prefetch("/");
    }
  }, [user, router]);

  const orderId = useMemo(
    () => orderInfo?.map((item) => item?.id).join(", "),
    [orderInfo]
  );

  const formatDate = (dateString: string, locale: string = "en") => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formatted = formatter.format(date);
    return locale === "ar" ? toArabicNumerals(formatted) : formatted;
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const firstOrderId = orderId
    .split(",")
    .map((id) => id.trim())
    .shift();

  const enrichedOrder = useMemo(() => {
    if (!selectedOrder || !foodData?.items) return null;

    const itemsWithNames = selectedOrder.order_items.map((item) => {
      const food = foodData.items.find(
        (foodItem) => foodItem.id === item.item_id
      );
      return {
        ...item,
        name: food?.name || `Item ${item.item_id}`,
      };
    });

    return {
      ...selectedOrder,
      order_items: itemsWithNames,
    };
  }, [selectedOrder, foodData?.items]);

  const localizedStatusStrings: Record<string, { en: string; ar: string }> = {
    order_received: { en: "Order Received", ar: "تم استلام الطلب" },
    accepted: { en: "Accepted", ar: "قيد المعالجة" },
    completed: { en: "Completed", ar: "اكتمل" },
    delivered: { en: "Delivered", ar: "تم التوصيل" },
    unknown: { en: "Unknown Status", ar: "حالة غير معروفة" },
  };
  if (isFoodLoading) {
    return <Loading />;
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <CommonHeader
        title={t("title")}
        secondarySubTitle={t("subtitle")}
        subtitle={
          locale === "ar"
            ? toArabicNumerals(`#${firstOrderId || ""}`)
            : `#${firstOrderId || ""}`
        }
        componentTitle={t("componentTitle")}
      />

      <div className="container mx-auto my-10 p-4">
        <div className="bg-white rounded-lg mb-10 min-h-screen shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("recentOrders")}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("orderId")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("date")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("total")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("progress")}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {orderInfo?.map((order) => {
                  const { id, status, total_amount, created_at } = order || {};
                  const progress = getOrderProgress(status);
                  const displayId =
                    locale === "ar" ? toArabicNumerals(id) : `#${id}`;
                  const displayTotal =
                    locale === "ar"
                      ? `${t("Currency")} ${toArabicNumerals(
                          Math.round(total_amount)
                        )}`
                      : `${t("Currency")} ${Math.round(total_amount)}`;
                  const displayProgress =
                    locale === "ar"
                      ? `${toArabicNumerals(progress)}%`
                      : `${progress}%`;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <td className="px-6 py-4">{displayId}</td>
                      <td className="px-6 py-4">
                        {created_at ? formatDate(created_at, locale) : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            status
                          )}`}
                        >
                          {lang === "ar" ? order.status_ar : status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{displayTotal}</td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#ecbf4c] h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {displayProgress}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#ecbf4c] flex items-center gap-1">
                          <FaEye className="h-4 w-4" />
                          {t("viewDetails")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && selectedOrder && enrichedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center p-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t("orderDetails")}
                </h2>
                <button onClick={closeModal}>
                  <FaTimes className="h-6 w-6 text-[#ecbf4c]" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaBox className="h-5 w-5 text-[#ecbf4c]" />
                      <span className="font-medium">{t("orderId")}:</span>
                      <span>
                        {locale === "ar"
                          ? toArabicNumerals(selectedOrder.id)
                          : `#${selectedOrder.id}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-5 w-5 text-[#ecbf4c]" />
                      <span className="font-medium">{t("orderDate")}:</span>
                      <span>
                        {selectedOrder.created_at
                          ? formatDate(selectedOrder.created_at, locale)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="h-5 w-5 text-[#ecbf4c]" />
                      <span className="font-medium">{t("total")}:</span>
                      <span>
                        {t("Currency")}
                        {locale === "ar"
                          ? toArabicNumerals(
                              Math.round(selectedOrder.total_amount)
                            )
                          : Math.round(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="overflow-hidden rounded-full bg-gray-200 mb-4">
                    <div
                      className={`h-3 ${getOrderStatus(
                        selectedOrder.status
                      )} rounded-full`}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {steps.map((step) => (
                      <div key={step.id} className="text-center">
                        <div
                          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${getOrderStatusForIcon(
                            selectedOrder.status,
                            step.name
                          )}`}
                        >
                          <step.icon
                            className={`h-6 w-6 ${
                              getOrderStatusForIcon(
                                selectedOrder.status,
                                step.name
                              ) === "bg-brand"
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          {lang === "ar" ? step.name_ar : step.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lang === "ar"
                            ? step.description_ar
                            : step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("orderItems")}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {enrichedOrder.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {lang === "ar" ? item.name_ar : item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t("qty")}:
                            {locale === "ar"
                              ? toArabicNumerals(item.quantity)
                              : item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {t("Currency")}
                          {locale === "ar"
                            ? toArabicNumerals(Math.round(item.price))
                            : Math.round(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("deliveryAddress")}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.fullname}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.delivery_address}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <LocationMap
                        latitude={parseFloat(selectedOrder.latitude)}
                        longitude={parseFloat(selectedOrder.longitude)}
                        MapId={`map-${selectedOrder.id}`} // ✅ Unique!
                        zoom={15}
                        onMapClick={(e) =>
                          console.log("Map clicked:", e.latlng)
                        }
                        onMarkerClick={(e) =>
                          console.log("Marker clicked:", e.latlng)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(OrderTrackingComponent);
