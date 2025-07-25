import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import Image from "next/image";

export const DashboardLoading = ({progress}: {progress: number}) => {
    return (
          <div className="min-h-screen w-full flex flex-col items-center mt-20">
            {/* <Spotlight
              className="-top-40 left-0 md:-top-20 md:left-80"
              fill="white"
            /> */}
            <div className="w-96 mb-8 animate-pulse flex items-center justify-center">
              <Image
                src="/3d-icons/3d-cloud-file.png"
                alt="dojo-logo"
                className="w-32 h-32"
                width={460}
                height={460}
              />
            </div>
            <h2 className="text-2xl  font-bold text-secondary-foreground mb-2">
              Preparing your dashboard data
            </h2>
            <p className="text-brand-beige-700 font-mono text-sm mb-6">
              Processing all your data in one place
            </p>
            <div className="w-80">
              <Progress value={progress} className="h-2 " />
            </div>
            <div className="mt-4 text-sm text-foreground flex items-center">
              <Zap className="h-4 w-4 mr-3 animate-spin text-emerald-600" />
              Checking your performance...
            </div>
          </div>
        );
}