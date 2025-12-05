"use client";

import Image from "next/image";

interface Company {
  id: string;
  name: string;
  logo: string;
  isTop?: boolean;
}

const companies: Company[] = [
  { id: "1", name: "FPT", logo: "/images/companies/image.png", isTop: true },
  { id: "2", name: "Apple", logo: "/images/companies/image1.png", isTop: true },
  { id: "3", name: "Samsung", logo: "/images/companies/image2.png", isTop: true },
  { id: "4", name: "Nvidia", logo: "/images/companies/image3.png", isTop: true },
  { id: "5", name: "Viettel", logo: "/images/companies/image4.png", isTop: true },
  { id: "6", name: "", logo: "/images/companies/image5.png" },
  { id: "7", name: "", logo: "/images/companies/image6.png" },
  { id: "8", name: "", logo: "/images/companies/image7.png" },
  { id: "9", name: "", logo: "/images/companies/image8.png" },
  { id: "10", name: "", logo: "/images/companies/image9.png" },
  { id: "11", name: "", logo: "/images/companies/image10.png" },
  { id: "12", name: "", logo: "/images/companies/image11.png" },
];

export function TopEmployers() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-6xl font-bold text-muted-foreground mb-12 text-center">
          Top Employers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center mb-10">
          {companies
            .filter((c) => c.isTop)
            .map((company) => (
              <div
                key={company.id}
                className="relative bg-card border border-border rounded-xl shadow-sm hover:shadow-md p-6 flex items-center justify-center transition"
              >
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  TOP
                </span>
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={100}
                  height={100}
                  className="object-contain mx-auto"
                />
              </div>
            ))}
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {companies
            .filter((c) => !c.isTop)
            .map((company) => (
              <div
                key={company.id}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={80}
                  height={80}
                  className="rounded-full object-contain"
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
