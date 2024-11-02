import { NextResponse } from "next/server";

export const myRes = (success, statusCode, message, data) => {
    const res = NextResponse.json({
        success,
        statusCode,
        message,
        data
    });

    return res;
}