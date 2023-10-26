"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { useAppDispatch } from "../state/hooks";
import { toggleTheme } from "../state/settingsSlice";
import { Authenticated, withAuth } from "../components/Authenticated";

function Home() {
  const dispatch = useAppDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <Authenticated adminOnly>
        <Button component={Link} href="/login">
          Login Page
        </Button>
        <Button onClick={handleToggleTheme}>Dark mode toggle</Button>
      </Authenticated>
    </>
  );
}

export default withAuth(Home);
