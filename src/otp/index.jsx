import { useRef, useState } from "react";
import "./style.css";

export default function OTP({count, onOTPComplete}) {
    // for masking
    const temp = ["💩", "😏", "🤢" ,"🤌"];

    const [otps, setOtps] = useState(new Array(count).fill(""));
    const [masking, setMasking] = useState(new Array(count).fill(""));

    // we need to create a list of inputrefs to store the reference to all inputtags
    const inputRefs = useRef([]);
    
    const handleKeyUp = (ind) => {
        return (event) => {
            const key = event.key;
            const oldOtps = [...otps];
            const oldMasking = [...masking];
            // console.log(key);

            // handling focus on arrow keys
            if(key === "ArrowRight") {
                moveFocus("right", ind);
                return;
            }
            if(key === "ArrowLeft") {
                moveFocus("left", ind);
                return;
            }


            // handling backspace
            if(key === "Backspace") {
                oldOtps[ind] = "";
                oldMasking[ind] = "";

                // move the focus to the previous input box if box is available
                moveFocus("left", ind);
                
                setOtps(oldOtps);
                setMasking(oldMasking);
                return;
            }


            // if pressed key is not a number then return do nothing
            if(isNaN(key))
                return;
            
            oldOtps[ind] = key;
            oldMasking[ind] = temp[ind];
            setOtps(oldOtps);
            setMasking(oldMasking);
            
            // move the focus to the next input box if box is available
            moveFocus("right", ind);

            const otpToSend = oldOtps.join("");
            if(otpToSend.length === count) {
                onOTPComplete(otpToSend);
            }
        }
    }

    const moveFocus = (dir, ind) => {
        if(dir === "right") {
            // const emptyBox = oldOtps.indexOf("");
            // if(emptyBox)
            //     inputRefs.current[emptyBox]?.focus();
                
            if(inputRefs.current[ind+1]) 
                inputRefs.current[ind+1]?.focus();
            
        }
        else {
            if(inputRefs.current[ind-1]) {
                inputRefs.current[ind-1]?.focus();
            }
        }
    }

    const handleClick = (ind) => {
        return (event) => {
            event.target.setSelectionRange(0,1);        // range of selection text
        }
    }

    const handlePaste = (ind) => {
        return (event) => {
            console.log("paste: ", event.clipboardData.getData("Text"));
            const pastedData = event.clipboardData.getData("Text").slice(0, count);
            if(!isNaN(pastedData)) {
                setOtps(pastedData.split(""));
                setMasking(temp);      
            }
        }
    }


    return <div>
        {
            new Array(count).fill("").map((_, ind) => {
                return (
                    <input 
                        ref={(iRef) => {
                            inputRefs.current[ind] = iRef
                        }}
                        inputMode="numeric"         // for mobile devices to turn on numberPad
                        onChange={(e) => {          // for  autofill the otp from mobile
                            const selectedData = e.target.value;
                            if(selectedData.length === count) {
                                const pastedData = event.clipboardData.getData("Text").slice(0, count);
                                if(!isNaN(selectedData)) {
                                    setOtps(selectedData.split(""));
                                    setMasking(temp);      
                                }
                            }
                        }}
                        maxLength={1}                   // for mobile devices, it needs to have onChange field, it disables autocomplete feature
                        autoComplete="one-time-code"    // mobile willl suggest code when any otp comes
                        onPaste={handlePaste(ind)}
                        onKeyUp={handleKeyUp(ind)} 
                        onClick={handleClick(ind)}
                        key={ind} 
                        type="text" 
                        value={otps[ind] ?? ""}
                    />
                )
            })
        }
        
        
    </div>
}