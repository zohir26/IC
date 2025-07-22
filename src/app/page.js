import Banner from "@/app/Shared/Banner";
import Navbar from "@/Components/Navbar/Navbar";
import '../app/globals.css'

import TopCategory from "@/app/topCategories/page";
import FindByBrands from "@/Components/FindByBrands";
import TopSearched from "@/app/Shared/TopSearched";
import OurClients from "@/app/Shared/OurClients";
import Footer from "@/app/Shared/Footer";
import CompareSection from "@/Components/CompareSection";
import RecentlyViewed from "@/app/Shared/RecenlyViewed";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import BlogsPage from "./blogs/page";
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
       <BlogsPage></BlogsPage>
      <Footer></Footer>
      
    </>
  );
}
