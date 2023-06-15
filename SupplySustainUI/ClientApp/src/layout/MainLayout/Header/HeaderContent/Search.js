// material-ui
import { Box, Button, FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = ({width , justifyContent, direction , search}) => {
  const { t, i18n } = useTranslation();
  return(
    <Box sx={{ width: "100%", ml: { xs: 0, md: 1 }, marginRight: "35px" }}>
      <FormControl sx={{ width: width ? width : { xs: "100%", md: 224 } , justifyContent: justifyContent ? justifyContent : null, direction: direction ? direction : null }}>
        <OutlinedInput
          size="small"
          id="header-search"
          onChange={(e) => search(e.target.value == undefined ? " " : e.target.value)}
          placeholder={t("جستجو...")}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: 1 }}>
              <Button sx={{ minWidth: "unset!important" }}>
                <SearchOutlined />
              </Button>
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            "aria-label": "weight"
          }}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
