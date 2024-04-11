import React from "react";
import T from "@/components/translations/translation";
import { useTranslation } from "react-i18next";

const LeftSideLogin = () => {
    const { i18n } = useTranslation();
    return (
        <div className="bg-mid_blue w-full md:w-1/2 h-full flex flex-col items-center justify-center md:pt-10 pb-10 pt-5 gap-y-10 md:gap-y-0">
            <div className="flex flex-row gap-x-2 justify-center mt-auto text-light_gray md:order-2">
                <p
                    onClick={() => {
                        i18n.changeLanguage("cs");
                        localStorage.setItem("i18nextLng", "cs");
                    }}
                    className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear mx-2"
                >
                    Česky
                </p>
                <p
                    onClick={() => {
                        i18n.changeLanguage("en");
                        localStorage.setItem("i18nextLng", "en");
                    }}
                    className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear mx-2"
                >
                    English
                </p>
                <p
                    onClick={() => {
                        i18n.changeLanguage("es");
                        localStorage.setItem("i18nextLng", "es");
                    }}
                    className="hover:font-semibold cursor-pointer transition-all duration-200 ease-linear mx-2"
                >
                    Español
                </p>
            </div>
            <div className="rounded-lg w-4/5 md:order-1">
                <img
                    src="/logo.svg"
                    alt="mysurface_logo"
                    className="mx-auto mb-10"
                    id="logo"
                />
                <h1 className="text-6xl text-light_gray font-fjalla text-center mb-5">
                    MySurface
                </h1>
                <hr className="w-1/2 mx-auto mb-5 border-2 border-light_gray" />
                <p className="text-light_gray font-glory text-center font-light text-xl w-4/5 lg:w-3/5 mx-auto">
                    <T tkey="login.slogan" />
                </p>
            </div>
        </div>
    );
};

export { LeftSideLogin };
