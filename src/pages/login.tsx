import { LoginForm } from "@/components/login-form";
import Logo from "@/assets/logo-henry.png"
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from "rive-react";
import { useTheme } from "@/contexts/theme-provider";

const STATE_MACHINE = "State Machine 1";


export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  
  const {rive, RiveComponent } = useRive({
    src: "cat.riv", 
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  const nightTrigger = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "Night?"
  );

const handleClick = () => {
    nightTrigger?.fire();
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }

  };
  
  return (
    
    <div className="grid min-h-svh xl:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-semibold text-[18px] text-[#4CC36F]">
            <div className="text-primary-foreground flex size-10 items-center justify-center rounded-md">
                <img src={Logo} />
            </div>
            UNCLE HENRY
          </a>
          
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      
         <div className="hidden xl:flex justify-end bg-[#6ac3d9] dark:bg-[#1c2348]">
            <RiveComponent className="w-[100%] h-[729px]" onClick={handleClick} />
         </div>
       {/*  */}
      
    </div>
  )
}

