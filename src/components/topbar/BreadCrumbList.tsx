import BreadCrumb, {BreadCrumbProps} from "./BreadCrumb";
import React from "react";
import {Icon} from "react-native-paper";

type BreadCrumbListProps = {
    items: BreadCrumbProps[];
}

const BreadCrumbList: React.FC<BreadCrumbListProps> = ({ items }) => {
    return (
        <>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <BreadCrumb text={item.text} onPress={item.onPress} />
                    {index < items.length - 1 && (
                        <Icon size={25} source="arrow-right" color="white" />
                    )}
                </React.Fragment>
            ))}
        </>
    );
};


export default BreadCrumbList;