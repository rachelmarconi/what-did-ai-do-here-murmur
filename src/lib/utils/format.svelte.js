export let percentFormat = $state(
  new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 })
);
export let precisePercentFormat = $state(
  new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 })
);
export let dollarFormat = $state(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  })
);
export let bigDollarFormat = $state(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    maximumSignificantDigits: 3,
    notation: "compact",
    compactDisplay: "short"
  })
);

export let preciseDollarFormat = $state(
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  })
);
export let normalFormat = $state(new Intl.NumberFormat("en-US"));

export let ratioFormat = $state(
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  })
);
