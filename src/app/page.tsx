"use client";
import { useAppDispatch } from "@/state/hooks";
import { toggleTheme } from "@/state/settingsSlice";
import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <Button component={Link} href="/login">
      Login Page
    </Button>
  );
}
