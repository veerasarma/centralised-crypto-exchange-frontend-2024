import isEmpty from "@/lib/isEmpty";
import React, { useEffect, useState } from "react";
import Select from "react-select";
// import { Dropdown, DropdownButton } from 'react-bootstrap'
// import styles from '@/styles/common.module.css';

export default function CountrySelect({ setCountry, country, type, init }: any) {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        let newArr: any = [];
        !isEmpty(type) &&
          type == "postAd" &&
          newArr.push({ value: "All", label: "All" });
        data.countries.map((item: any) => {
          let labelVal = item.label.split(" ").slice(1);
          labelVal = labelVal.join(" ");
          newArr.push({ value: item.value, label: labelVal });
        });
        setCountries(newArr);
        let labelVal = data.userSelectValue.label.split(" ").slice(1);
        labelVal = labelVal.join(" ");
        if (!isEmpty(type)) {
          if (type == "postAd") {
            let findCntry = data?.countries.find((item: any) => item?.value?.toLowerCase() == init?.toLowerCase())
            if (!isEmpty(findCntry)) {
              let labelVal = findCntry.label.split(" ").slice(1);
              labelVal = labelVal.join(" ");
              setCountry({ value: findCntry.value, label: labelVal });
            } else {
              setCountry({ value: "All", label: "All" });
            }
          } else {

          }
        } else if (isEmpty(type)) {
          setCountry({
            value: data.userSelectValue.value,
            label: labelVal,
          });
        }
      });
  }, []);
  const colourStyles = {
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      background: isFocused
        ? "var(--yellow_shade)"
        : isSelected
          ? "var(--yellow_shade)"
          : undefined,
      zIndex: 1,
    }),
  };
  return (
    // <div className={`mb-3 ${styles.input_box} `}>
    //   <DropdownButton id="dropdown-basic-button" className={`mb-3  dwn_btn ${styles.drp_down}`} title={country ? country.label : 'Select country'} onSelect={(eventKey: any) => { }} >
    //     {
    //       countries?.length > 0 && countries.map((item: any, index: number) => {
    //         return (
    //           <Dropdown.Item eventKey={index} onClick={() => setCountry(item)} className="dwn_item">
    //             {item.label}
    //           </Dropdown.Item>
    //         )
    //       })
    //     }
    //   </DropdownButton>
    // </div>
    <Select
      options={countries}
      stype={colourStyles}
      value={country}
      styles={colourStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      onChange={(selectedOption: any) => setCountry(selectedOption)}
    />
  );
}
