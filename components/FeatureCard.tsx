import Link from "next/link";
import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
};

export default function FeatureCard({
  title,
  description,
  icon,
  path,
}: FeatureCardProps) {
  return (
    <Link href={path} className="block h-full">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:scale-105 hover:border-blue-500 transition duration-300 cursor-pointer h-full">

        <div className="text-blue-400 text-3xl mb-4">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {title}
        </h2>

        <p className="text-gray-300">
          {description}
        </p>

      </div>
    </Link>
  );
}