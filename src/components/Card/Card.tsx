import * as React from "react";
import "./Card.scss";

function Card({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`card ${className}`} {...props} />;
}

function CardHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`card-header ${className}`} {...props} />;
}

function CardTitle({ className = "", ...props }: React.ComponentProps<"h4">) {
  return <h4 className={`card-title ${className}`} {...props} />;
}

function CardDescription({ className = "", ...props }: React.ComponentProps<"p">) {
  return <p className={`card-description ${className}`} {...props} />;
}

function CardAction({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`card-action ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`card-content ${className}`} {...props} />;
}

function CardFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`card-footer ${className}`} {...props} />;
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
