import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";

export default function Review() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/review");
    }

    return (
        <div className="w-screen">
            <PageHeader
                leftButtons={[
                    { text: "외주 후기", onClick: handleNavigate }
                ]}
            />
             <div className="flex gap-4 w-full max-w-[100rem] mx-auto">
                <div className="h-80 bg-zinc-300 w-full" />
                <div className="h-80 bg-orange-400 w-full" />
                <div className="h-80 bg-zinc-300 w-full" />

                </div>
            <div className="max-w-[60rem] flex items-center mx-auto mt-8 flex-col">
               <h1 className="text-lg font-bold mr-auto">BEST 후기</h1>
               <div className="mt-4 flex items-center gap-6">
                <div className="w-56 h-40 bg-blue-500/20 rounded-[5px] shadow-md"/>
                <div className="w-56 h-40 bg-yellow-400/5 rounded-[5px] shadow-md"/>
                <div className="w-56 h-40 bg-blue-500/20 rounded-[5px] shadow-md"/>
                <div className="w-56 h-40 bg-yellow-400/5 rounded-[5px] shadow-md"/>
               </div>
            </div>
        </div>
    )
}