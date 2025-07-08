import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";

interface StatItemProps {
  value: number;
  label: string;
  subLabel: string;
}

const StatItem = ({ value, label, subLabel }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  // dynamic stats count for custom animations
  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const progressRatio = Math.min(progress / duration, 1);
      setCount(Math.floor(progressRatio * value));
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center w-full md:items-start"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-black">
          {lang === "ar" ? toArabicNumerals(count) : count}
        </span>
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-medium text-white/90 uppercase">
            {label}
          </span>
          <span className="text-sm md:text-base font-medium text-white/90 uppercase">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProjectStatusCounter = () => {
  const locale = useLocale();
  const t = useTranslations();

  const lang = locale === "ar" ? "ar" : "en";
  // data local json file for project status counter but can be fetched from an API using redux toolkit query
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-full bg-[#ecbf4c] py-16 md:py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          <StatItem
            value={8}
            label={t("stats.new.label")}
            subLabel={t("stats.new.subLabel")}
          />
          <StatItem
            value={700}
            label={t("stats.total.label")}
            subLabel={t("stats.total.subLabel")}
          />
          <StatItem
            value={15}
            label={t("stats.unique.label")}
            subLabel={t("stats.unique.subLabel")}
          />
          <StatItem
            value={200}
            label={t("stats.hard.label")}
            subLabel={t("stats.hard.subLabel")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusCounter;
