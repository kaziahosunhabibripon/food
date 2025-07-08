"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CommonHeader from "../common/CommonHeader";
import AppTitleHeader from "@/helpers/ui/AppTitleHeader";
import { teamMembers } from "@/data/teamMembersData";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight } from "react-feather";
import { CountUp } from "countup.js";
import { useLocale, useTranslations } from "next-intl";
import { toArabicNumerals } from "@/helpers/ui/Arabic";

gsap.registerPlugin(ScrollTrigger);

const storyData = [
  {
    en: [
      {
        image: "/assets/about-1.jpeg",
        alt: "FoodieDelight story part 1",
        title: "Our Story",
        paragraphs: [
          "Excellency was born from a passion for authentic flavor, warm hospitality, and an unwavering commitment to quality. Established in 2020, we started as a small dining spot with a big dream — to bring people together over food that feels like home. Our founders, inspired by culinary traditions from around the world, laid the foundation for a restaurant that values heart, heritage, and honest taste.Over the years, our name has become a symbol of consistency, taste, and trust. What began with a few tables and a handful of signature dishes has now grown into a destination for food lovers seeking a memorable experience.",
        ],
      },
      {
        image: "/assets/about-2.jpeg",
        alt: "FoodieDelight story part 2",
        title: "Our Journey",
        paragraphs: [
          "From humble beginnings to becoming a respected name in the food industry, our journey has been one of growth, learning, and community. We’ve expanded our menu, modernized our space, and introduced new flavors — but our core values remain the same: authenticity, passion, and excellence.Our team of skilled chefs and dedicated staff strive every day to create more than just meals — we create moments. Every plate is a result of careful thought, attention to detail, and a desire to surprise and satisfy.As we continue forward, we remain grateful to our loyal guests and excited for all that lies ahead. Excellency is not just our name — it’s our promise.",
        ],
      },
    ],
    ar: [
      {
        image: "/assets/about-1.jpeg",
        alt: "قصة فودي ديلايت - الجزء الأول",
        title: "قصتنا",
        paragraphs: [
          "لقد ولدت السعادة من شغف بالنكهة الأصيلة ، والضيافة الدافئة ، والالتزام الثابت بالجودة. تم تأسيسها في عام 2020 ، وبدأنا كبقعة صغيرة لتناول الطعام مع حلم كبير - لجمع الناس على الطعام الذي يشعر وكأنه في المنزل. وقد نمت الآن حفنة من الأطباق المميزة لتصبح وجهة لمحبي الطعام الذين يبحثون عن تجربة لا تنسى. ",
        ],
      },
      {
        image: "/assets/about-2.jpeg",
        alt: "قصة فودي ديلايت - الجزء الثاني",
        title: "رحلتنا",
        paragraphs: [
          "من بدايات متواضعة إلى أن أصبحنا اسمًا مرموقًا في صناعة الأغذية، كانت رحلتنا مليئة بالنمو، والتعلم، وبناء المجتمع. قمنا بتوسيع قائمتنا، وتحديث مساحتنا، وإدخال نكهات جديدة — ولكن قيمنا الأساسية بقيت كما هي: الأصالة، والشغف، والتميّز. يسعى فريقنا من الطهاة المهرة والموظفين المخلصين كل يوم إلى تقديم ما هو أكثر من مجرد وجبات — إننا نصنع لحظات. كل طبق نعدّه هو نتيجة للتفكير الدقيق، والانتباه للتفاصيل، والرغبة في المفاجأة والإرضاء. بينما نواصل المضي قدمًا، نبقى ممتنين لضيوفنا الأوفياء ومتحمسين لما ينتظرنا في المستقبل. “إكسلنسي” ليس مجرد اسم — بل هو وعد.",
        ],
      },
    ],
  },
];
const qualityData = {
  en: [
    {
      icon: "🍽️",
      label: "Quality",
      description:
        "We're committed to delivering the highest quality meals and service.",
    },
    {
      icon: "🤝",
      label: "Community",
      description:
        "We support local restaurants and foster a sense of community.",
    },
    {
      icon: "💡",
      label: "Innovation",
      description:
        "We continuously innovate to improve the food delivery experience.",
    },
  ],
  ar: [
    {
      icon: "🍽️",
      label: "الجودة",
      description: "نحن ملتزمون بتقديم أعلى جودة في الوجبات والخدمة.",
    },
    {
      icon: "🤝",
      label: "المجتمع",
      description: "ندعم المطاعم المحلية ونشجع على روح المجتمع.",
    },
    {
      icon: "💡",
      label: "الابتكار",
      description: "نحن نبتكر باستمرار لتحسين تجربة توصيل الطعام.",
    },
  ],
};

const AboutUs = () => {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const t = useTranslations();
  const buttonRef = useRef(null);
  const countRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  // about us page component data form api local data and static data

  const stats = [
    {
      value: "2+",
      labelEn: "Growing Years",
      labelAr: "سنوات النمو",
      color: "text-[#ecbf4c]",
    },
    {
      value: "254+",
      labelEn: "Type of Products",
      labelAr: "أنواع المنتجات",
    },
    {
      value: "2+",
      labelEn: "Sales Outlets",
      labelAr: "نقاط البيع",
    },
    {
      value: "200000+",
      labelEn: "Annual Sales",
      labelAr: "المبيعات السنوية",
      display: "2L+",
    },
  ];

  // AOS
  useEffect(() => {
    AOS.init({ offset: 120, duration: 2000, easing: "ease-out" });
  }, []);

  // GSAP CTA Button Animation
  useEffect(() => {
    if (!buttonRef.current) return;

    gsap.fromTo(
      buttonRef.current,
      { x: "-100%", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          scrub: true,
          once: true,
        },
      }
    );

    ScrollTrigger.refresh();
  }, []);

  // GSAP CountUp Animations
  useEffect(() => {
    const timeout = setTimeout(() => {
      countRefs.current.forEach((el, index) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            delay: index * 0.2,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
              onEnter: () => {
                const countUpEl = el.querySelector(
                  ".countup"
                ) as HTMLElement | null;
                if (countUpEl && !countUpEl.dataset.started) {
                  const end = parseFloat(countUpEl.dataset.end ?? "0");
                  const suffix = countUpEl.dataset.suffix || "";
                  const format = countUpEl.dataset.format;

                  const countUp = new CountUp(countUpEl, end, {
                    duration: 2,
                    suffix,
                    // Use a callback on each frame to convert digits if Arabic locale
                    // We'll override the default formatting
                    formattingFn: (value) => {
                      const str = `${value}${suffix}`;
                      return locale === "ar" ? toArabicNumerals(str) : str;
                    },
                  });

                  if (!countUp.error) {
                    countUp.start(() => {
                      if (format) {
                        countUpEl.innerText =
                          locale === "ar" ? toArabicNumerals(format) : format;
                      }
                    });
                    countUpEl.dataset.started = "true";
                  }
                }
              },
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timeout);
  }, [locale]);

  // Story Section Animation
  useEffect(() => {
    sectionsRef.current.forEach((section, i) => {
      if (!section) return;
      const image = section.querySelector(".image");
      const content = section.querySelector(".content");
      if (!image || !content) return;

      const fromXImage = i % 2 === 0 ? -100 : 100;
      const fromXContent = i % 2 === 0 ? 100 : -100;

      gsap.fromTo(
        image,
        { x: fromXImage, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
        }
      );

      gsap.fromTo(
        content,
        { x: fromXContent, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          delay: 0.3,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <CommonHeader
        title={t("aboutus.title")}
        subtitle={t("aboutus.subtitle")}
        componentTitle={t("aboutus.componentTitle")}
      />

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          <AppTitleHeader
            title={t("aboutus.story")}
            subtitle={t("aboutus.story1")}
          />
          {storyData[0][lang].map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                sectionsRef.current[index] = el;
              }}
              className={`flex flex-col md:flex-row items-center gap-8 my-12  overflow-x-hidden ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="md:w-1/2 image opacity-0 p-4">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={800}
                  height={250}
                  loading="lazy"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 content space-y-4 opacity-0">
                <div key={index} className="my-8">
                  {item.paragraphs.map((text, pIndex) => (
                    <p key={pIndex} className="text-gray-600 text-lg mb-4">
                      {locale === "ar" ? toArabicNumerals(text) : text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section
        className="bg-orange-50 py-16 px-4 sm:px-6 lg:px-8"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <AppTitleHeader
            title={t("aboutus.values")}
            subtitle={t("aboutus.values1")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {qualityData[lang].map(({ icon, label, description }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg p-6 text-center transform transition duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{label}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <AppTitleHeader
            title={t("aboutus.team")}
            subtitle={t("aboutus.team1")}
            secondarySubTitle={t("aboutus.team2")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:-translate-y-2"
              >
                <Image
                  src={member.image}
                  alt={member.name[locale]}
                  width={800}
                  height={800}
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <p className="text-gray-600 font-bold">
                    {member.role[locale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#ecbf4c] text-white py-16 mb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="p-1" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("aboutus.cta_title")}
            </h2>
            <p className="text-xl mb-8">{t("aboutus.cta_subtitle")}</p>
          </div>
          <div ref={buttonRef}>
            <Link
              href="/all-products"
              className="inline-block bg-gray-50 text-brand font-bold py-3 px-8 rounded-full text-lg transition duration-300 hover:bg-gray-100 hover:shadow-lg"
            >
              <span className="flex justify-center items-center">
                {t("aboutus.order_now")}
                <ArrowRight className="w-5 h-5 ms-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Count Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-full">
              <div className="py-10">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {stats.map((stat, index) => {
                    const numberMatch =
                      stat.value.match(/^(\d+)([a-zA-Z+]+)?$/);
                    const number = numberMatch ? parseInt(numberMatch[1]) : 0;
                    const suffix = numberMatch?.[2] || "";

                    const rawDisplay = stat.display || `${number}${suffix}`;
                    const display =
                      locale === "ar"
                        ? toArabicNumerals(rawDisplay)
                        : rawDisplay;
                    const label = locale === "ar" ? stat.labelAr : stat.labelEn;

                    return (
                      <div
                        key={index}
                        ref={(el) => {
                          countRefs.current[index] = el;
                        }}
                      >
                        <div
                          className={`countup text-5xl font-extrabold ${
                            stat.color || "text-slate-500"
                          }`}
                          data-end={number}
                          data-suffix={suffix}
                          data-format={display}
                        >
                          {locale === "ar"
                            ? toArabicNumerals(`0${suffix}`)
                            : `0${suffix}`}
                        </div>

                        <div
                          className={`text-md font-normal mt-1 ${
                            stat.color || "text-gray-500"
                          }`}
                        >
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
