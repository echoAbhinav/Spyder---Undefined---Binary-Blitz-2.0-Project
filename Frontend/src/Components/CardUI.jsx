import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";

const CardUI = ({ title, description, icon }) => {
  return (
    <Card className="overflow-hidden w-fit transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ">
      <CardHeader className="pb-4 flex flex-col">
        <div className=" title text-xl font-bold w-full ">{title}</div>
        <div className="desc text-sm text-slate-500">{description}</div>
      </CardHeader>
      <CardBody className="h-fit">
        <div className="flex justify-center items-center h-24 ">{icon}</div>
      </CardBody>
      <CardFooter>
        <Button color="primary" className="w-full">
          Use Feature
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardUI;
