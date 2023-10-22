"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { useAppDispatch } from "../state/hooks";
import { toggleTheme } from "../state/settingsSlice";

export default function Home() {
  const dispatch = useAppDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <Button component={Link} href="/login">
        Login Page
      </Button>
      <Button onClick={handleToggleTheme}>Dark mode toggle</Button>
    </>
  );
}
