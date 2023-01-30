export const getCreators = (array: any[]) => {
    const finalized: { seller: string; sumall: any; }[] = [];
  
    const result = array.reduce((res: { [x: string]: never[]; }, currentValue: { seller: string | number; }) => {
      (res[currentValue.seller] = res[currentValue.seller] || []).push(currentValue);
  
      return res;
    }, {});
  
    Object.entries(result).forEach((itm) => {
      const seller = itm[0];
      const sumall = itm[1].map((item: { price: any; }) => Number(item.price)).reduce((prev: any, curr: any) => prev + curr, 0);
  
      finalized.push({ seller, sumall });
    });
  
    return finalized;
  };