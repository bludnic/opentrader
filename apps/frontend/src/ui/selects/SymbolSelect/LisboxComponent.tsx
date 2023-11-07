import React from "react";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { RenderOptionParams } from "./renderOption";
import { CryptoIcon } from "src/ui/icons/CryptoIcon";
import AutocompleteListbox from "@mui/joy/AutocompleteListbox";
import { Popper } from "@mui/base/Popper";

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
    <AutocompleteOption {...rowProps} style={inlineStyle} key={symbol.symbolId}>
      <ListItemDecorator>
        <CryptoIcon symbol={symbol.baseCurrency} />
      </ListItemDecorator>
      <ListItemContent sx={{ fontSize: "sm" }}>
        {symbol.currencyPair}
      </ListItemContent>
    </AutocompleteOption>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
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

export const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  {
    anchorEl: any;
    open: boolean;
    modifiers: any[];
  } & React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, anchorEl, open, modifiers, ...other } = props;
  const itemData: Array<any> = [];
  (
    children as [Array<{ children: Array<React.ReactElement> | undefined }>]
  )[0].forEach((item) => {
    if (item) {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  });

  const itemCount = itemData.length;

  return (
    <Popper
      ref={ref}
      anchorEl={anchorEl}
      open={open}
      modifiers={modifiers}
      style={{
        zIndex: 1000,
      }}
    >
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={LIST_ITEM_HEIGHT * VISIBLE_OPTIONS_COUNT}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={LIST_ITEM_HEIGHT}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </Popper>
  );
});
