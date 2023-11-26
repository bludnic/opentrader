import React, { createContext, forwardRef, useContext } from "react";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import type { ListChildComponentProps } from "react-window";
import { FixedSizeList } from "react-window";
import AutocompleteListbox from "@mui/joy/AutocompleteListbox";
import { Popper } from "@mui/base/Popper";
import { CryptoIcon } from "src/ui/icons/CryptoIcon";
import type { RenderOptionParams } from "./renderOption";

const LISTBOX_PADDING = 8; // px
const LIST_ITEM_HEIGHT = 48; // px
const VISIBLE_OPTIONS_COUNT = 8; // number of visible options in the dropdown

function renderRow(props: ListChildComponentProps<RenderOptionParams[]>) {
  const { data, index, style } = props;
  const [rowProps, symbol] = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
    height: LIST_ITEM_HEIGHT,
  };

  return (
    <AutocompleteOption {...rowProps} key={symbol.symbolId} style={inlineStyle}>
      <ListItemDecorator>
        <CryptoIcon symbol={symbol.baseCurrency} />
      </ListItemDecorator>
      <ListItemContent sx={{ fontSize: "sm" }}>
        {symbol.currencyPair}
      </ListItemContent>
    </AutocompleteOption>
  );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return (
    <AutocompleteListbox
      {...props}
      {...outerProps}
      component="div"
      ref={ref}
      sx={{
        "& ul": {
          padding: 0,
          margin: 0,
          flexShrink: 0,
        },
      }}
    />
  );
});
OuterElementType.displayName = "OuterElementType";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any -- will be typed later */
export const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  {
    anchorEl: any;
    open: boolean;
    modifiers: any[];
  } & React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, anchorEl, open, modifiers, ...other } = props;
  const itemData: any[] = [];
  (children as [{ children: React.ReactElement[] | undefined }[]])[0].forEach(
    (item) => {
      if (item) {
        itemData.push(item);
        itemData.push(...(item.children || []));
      }
    },
  );

  const itemCount = itemData.length;

  return (
    <Popper
      anchorEl={anchorEl}
      modifiers={modifiers}
      open={open}
      ref={ref}
      style={{
        zIndex: 1000,
      }}
    >
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          height={LIST_ITEM_HEIGHT * VISIBLE_OPTIONS_COUNT}
          innerElementType="ul"
          itemCount={itemCount}
          itemData={itemData}
          itemSize={LIST_ITEM_HEIGHT}
          outerElementType={OuterElementType}
          overscanCount={5}
          width="100%"
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </Popper>
  );
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any -- will be typed later */
