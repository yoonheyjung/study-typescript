# 나라스페이스 백엔드 사전 과제

## Tech Stack

Server: Node, Express

DataBase: postgres, typeorm

postgres에 postgis 추가 설치하기

</br>

## 시작하기

```
# 의존성 설치
npm install

# 개발 환경에서 실행 (nodemon 사용)
npm run start:dev

# 빌드 후 실행
npm run build
npm start
```

### DB 설치 및 초기 설정

```
cd docker
docker-compose up -d
docker exec -it naraDB psql -U postgres    # DB 접속
CREATE DATABASE nara;
CREATE EXTENSION postgis;
docker-compose restart postgres   # 재시작
```

초기 데이터 삽입은 index.ts 에 작성되어있음.
초기에 한 번 `await memberData();`, `await geoData();` 주석 해제

**주요 스크립트**

- `npm test`: 테스트 실행
- `npm start`: 빌드된 애플리케이션 실행
- `npm start:dev`: 개발 환경에서 nodemon으로 실행
- `npm run api-docs`: Swagger 문서 생성

## 프로젝트 구조

```
src
│
├── controllers
│   └── member.controller.ts  # member와 관련한 컨트롤러
│
├── data            # 초기데이터 / json : 데이터
│   ├── user_data
│   │   ├── user01.json
│   │   └── ...
│   ├── koreaGeo.json
│   ├── insertGeoData.ts  # DB에 데이터 삽입
│   └── insertMemberData.ts
│
├── entities        # TypeORM 엔터티 클래스들
│   ├── member.entity.ts
│   ├── score.entity.ts
│   └── district.entity.ts
│
├── models          # TypeORM 설정 및 초기화 파일들
│   └── index.ts
│
├── routes          # Express 라우터
│   ├── member.route.ts
│   └── ...
│
├── service         # 비즈니스 로직 서비스
│   ├── member.service.ts
│   ├── csv.service.ts
│   └── score.service.ts
│
├── swagger         # Swagger 문서 및 설정 파일
│   └── swagger.yaml
│
├── util            # 유틸리티 함수들
│   ├── date.util.ts
│   └── errors.util.ts
│
└── index.ts         # 애플리케이션 진입점

```

---

### Todo List

- Error 관리
- Validation check
- DB 접속 정보 등 환경변수로 처리
- 로그 파일 별도 관리
