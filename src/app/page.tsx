"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { withAuth } from "../components/Authenticated";
import { useAppDispatch } from "../state/hooks";
import { toggleTheme } from "../state/settingsSlice";

function Home() {
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

export default withAuth(Home);
