import ListItemIcon from "@mui/material/ListItemIcon";
import React from "react";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { ListItem, ListItemText } from "@mui/material";
import { RenderOptionParams } from "src/components/ui/CryptoCoinSelector/renderOption";
import { CryptoIcon } from "src/components/ui/CryptoIcon";

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
    <ListItem
      key={symbol.currencyPair}
      component="li"
      {...rowProps}
      style={inlineStyle}
    >
      <ListItemIcon>
        <CryptoIcon symbol={symbol.baseCurrency} />
      </ListItemIcon>
      <ListItemText primary={symbol.currencyPair} />
    </ListItem>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});
OuterElementType.displayName = "OuterElementType";

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

export const VariableSizeListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function VariableSizeListboxComponent(props, ref) {
  const { children, ...other } = props;
  const optionsData = children as RenderOptionParams[];

  const itemCount = optionsData.length;

  const getHeight = () => {
    const visibleOptionsCount =
      itemCount > VISIBLE_OPTIONS_COUNT ? VISIBLE_OPTIONS_COUNT : itemCount;

    return visibleOptionsCount * LIST_ITEM_HEIGHT;
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={optionsData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => LIST_ITEM_HEIGHT}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});
