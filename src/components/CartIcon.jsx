// ts-strict

import React from "react";
import { ActionIcon, Indicator, Tooltip } from "@mantine/core";
import { useSelector } from "react-redux";
import { ShoppingCart } from "react-feather";
import { Link } from "react-router";

// selectors
import { selectCartTotalItems } from "../state/selectors/cartSelector";

const CartIcon = ({ size = 24, ...props }) => {
  const totalItems = useSelector(selectCartTotalItems);

  return (
    <Tooltip label={`${totalItems} items in cart`}>
      <Indicator
        label={totalItems > 0 ? totalItems : null}
        size={16}
        color="red"
        disabled={totalItems === 0}
        offset={7}
      >
        <ActionIcon
          component={Link}
          to="/cart"
          variant="subtle"
          size="lg"
          radius="xl"
          {...props}
        >
          <ShoppingCart size={size} />
        </ActionIcon>
      </Indicator>
    </Tooltip>
  );
};

export default CartIcon;
