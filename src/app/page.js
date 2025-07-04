import Banner from "@/Shared/Banner";
import Navbar from "@/Shared/Navbar";
import '../app/globals.css'

import TopCategory from "@/Shared/TopCategory";
import FindByBrands from "@/Shared/FindByBrands";
import TopSearched from "@/Shared/TopSearched";
import OurClients from "@/Shared/OurClients";
import Footer from "@/Shared/Footer";
import CompareSection from "@/Shared/Compare";
import RecentlyViewed from "@/Shared/RecenlyViewed";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <>

      <div>
        <Navbar session={session}>
        </Navbar>
      </div>
      <Banner></Banner>
      <CompareSection></CompareSection>
      <RecentlyViewed></RecentlyViewed>
      <TopCategory></TopCategory>
      <FindByBrands></FindByBrands>
      <TopSearched></TopSearched>
      <OurClients></OurClients>
      <Footer></Footer>

    </>
  );
}
