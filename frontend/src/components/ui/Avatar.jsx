import { twMerge } from "tailwind-merge";

export const Avatar = ({ src, alt, className, online = false }) => {
    const firstLetter = alt ? alt.charAt(0).toUpperCase() : "?";
    
    // Check if src is missing or is from the default avatar service
    const isDefaultAvatar = !src || src.includes("avatar.iran.liara.run");

    return (
        <div className={twMerge("relative inline-block h-10 w-10 shrink-0", className)}>
            {!isDefaultAvatar ? (
                <img
                    src={src}
                    alt={alt || "Avatar"}
                    className="h-full w-full rounded-full object-cover border border-gray-200"
                />
            ) : (
                <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border border-blue-700 select-none shadow-sm">
                    {firstLetter}
                </div>
            )}
            {online && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
            )}
        </div>
    );
};
