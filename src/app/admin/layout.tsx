"use client";
import { AuthenticatedPage } from "../../components/Authenticated";

export default function AdminLayout(props: { children: any }) {
  return (
    <AuthenticatedPage adminOnly={true}>{props.children}</AuthenticatedPage>
  );
}
