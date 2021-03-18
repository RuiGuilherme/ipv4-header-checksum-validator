
A Basic Application for Validating IPv4 Header Checksum 

#### Prerequisites

<ul>
<li>nodejs:lasted</li>
<li>yarn:lasted</li>
</ul> 

#### Usage/Install

```bash
$ git clone https://github.com/RuiGuilherme/ipv4-header-checksum-validator.git
$ cd ipv4-header-checksum-validator
$ yarn
$ yarn start
```
The application will be available on 127.0.0.1:8000 

#### Valid examples
```
4500 16D8 1250 4000 4006 0000 C881 B028 BFDF B771
21D5

4500 0514 42A2 2140 8001 0000 C0A8 0003 C0A8 0001
50B2
```

#### Not valid examples
```
4500 0034 2800 4000 7206 0000 C904 02B2 C881 B028
9C63

4500 0028 1544 4000 7206 0000 CB08 2382 C881 B028
9C57
```

#### Known issue
<ul>
<li>Only in Brazilian Portuguese </li>
</ul>

#### Demo
For now not available 

#### Author
###### Rui Guilherme
[GitHub](https://github.com/RuiGuilherme/)
<br/>
[Linkedin](https://www.linkedin.com/in/rui-guilherme/)

#### Contributing
Contributions, issues and feature requests are welcome!
