import Link from "next/link";
import { Icon } from "./IconSprite";

interface Props {
  signInHref: string;
}

/**
 * Sits where the rest of a note would be, for a signed-out visitor.
 *
 * The idea block above this is real, server-rendered content — that split is
 * what lets the free preview still rank in search while the actual body stays
 * gated. See src/app/learn/[course]/[slug]/page.tsx and docs/blueprint.md
 * §13 for why the line is drawn exactly at the first heading.
 */
export function ReadMoreGate({ signInHref }: Props) {
  return (
    <div className="gate" role="note">
      <Icon name="i-box" />
      <div>
        <p className="gate__title">Sign in to keep reading</p>
        <p className="gate__body">
          The idea above is free. The full explanation, worked examples, and exam tips are for
          signed-in students.
        </p>
      </div>
      <Link href={signInHref} className="btn btn--primary">
        Sign in
      </Link>
    </div>
  );
}
