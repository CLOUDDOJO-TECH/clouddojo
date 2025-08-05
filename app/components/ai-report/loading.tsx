import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";
import Image from "next/image";

export const AIAnalysisLoading = ({progress}: {progress: number}) => {
    return (
          <div className="min-h-screen px-3 w-full flex flex-col items-center mt-20">
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
              Generating Your AI Analysis Report
            </h2>
            <p className="text-brand-beige-700 text-center font-mono text-sm mb-6">
              This may take a few moments depending on the length of your report.
              Please wait while we analyze your performance and generate insights.  
            </p>
            <div className="w-80">
              <Progress value={progress} className="h-2 " />
            </div>
            <div className="mt-4 text-sm text-foreground flex items-center">
              <Zap className="h-4 w-4 mr-3 animate-spin text-emerald-600" />
              Might take a few minutes...
            </div>
          </div>
        );
}