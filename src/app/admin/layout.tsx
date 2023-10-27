"use client";
import { Authenticated } from "../../components/Authenticated";

export default function AdminLayout(props: { children: any }) {
  return <Authenticated adminOnly={true}>{props.children}</Authenticated>;
}
