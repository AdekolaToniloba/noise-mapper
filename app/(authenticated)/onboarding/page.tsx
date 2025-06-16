// app/(authenticated)/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const onboardingSteps = [
  {
    id: 1,
    title: "Explore the map",
    description:
      "Tap on the map to view noise levels, search for locations, and access the quiet route feature.",
    image: (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 bg-teal-600 rounded-lg shadow-lg">
          <div className="absolute inset-2 bg-teal-700 rounded-lg">
            <div className="grid grid-cols-8 gap-0.5 p-2 h-full">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="bg-teal-500 opacity-20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Record noise data",
    description:
      "Use the record noise data feature to measure decibel levels at your location. This helps us accurately assess noise pollution in the area.",
    image: (
      <div className="relative w-64 h-64 mx-auto">
        <div className="bg-teal-700 rounded-2xl p-8 shadow-lg">
          <div className="bg-teal-600 rounded-xl p-6">
            <svg
              className="w-32 h-32 mx-auto text-teal-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <div className="mt-4 h-8 bg-teal-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Find your quiet in the city",
    description:
      "Discover the quietest walking routes through the city based on real-time noise data from our community.",
    image: (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 blur-xl opacity-50" />
            <svg
              className="relative w-48 h-48 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 15l3-2 3 2m-6 2l3-2 3 2"
              />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      toast.success("Welcome to Noise Map!");

      // Force a hard refresh to update the session
      //   window.location.href = "/";
      router.push("/profile");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to complete onboarding"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-between p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Soundscape</h1>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-md"
            >
              <div className="mb-8">{onboardingSteps[currentStep].image}</div>
              <h2 className="text-2xl font-bold mb-4">
                {onboardingSteps[currentStep].title}
              </h2>
              <p className="text-gray-600 text-base">
                {onboardingSteps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading...
              </span>
            ) : currentStep === onboardingSteps.length - 1 ? (
              "Get Started"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
