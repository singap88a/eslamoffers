import Image from "next/image";
import Hero from "./components/home/Hero";
import Categories from "./components/home/Categories";
 import OffersSection from "./components/home/Coupon/OffersSection";
import Numbers_matter from "./components/home/Numbers_matter";

export default function Home() {
  return (
  <div>
    <Hero/>
    <Categories/>
    <OffersSection/>
<Numbers_matter/>

  </div>
  );
}
